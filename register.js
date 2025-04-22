// Form Navigation
let currentStep = 1;
const totalSteps = 4;
const form = document.getElementById('registrationForm');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.getElementById('progressText');
const successModal = document.getElementById('successModal');

// Update progress bar
function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Step ${currentStep}/${totalSteps}`;
}

// Show/hide steps
function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    updateProgress();
}

// Next step button handler
document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            showStep(currentStep + 1);
        }
    });
});

// Previous step button handler
document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', () => {
        showStep(currentStep - 1);
    });
});

// Validate each step
function validateStep(step) {
    const currentStepElement = document.getElementById(`step${step}`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
        }
    });

    if (!isValid) {
        showError('Please fill in all required fields');
    }

    return isValid;
}

// Team member management
let memberCount = 0;
const maxMembers = 4;
const membersContainer = document.getElementById('membersContainer');
const addMemberButton = document.getElementById('addMember');

addMemberButton.addEventListener('click', () => {
    if (memberCount < maxMembers) {
        addMemberCard();
        memberCount++;
        if (memberCount === maxMembers) {
            addMemberButton.style.display = 'none';
        }
    }
});

function addMemberCard() {
    const memberCard = document.createElement('div');
    memberCard.className = 'member-card bg-fire-dark p-4 rounded-lg';
    memberCard.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-yellow-400 font-bold">Team Member ${memberCount + 1}</h3>
            <button type="button" class="remove-member text-red-500 hover:text-red-400">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="grid grid-cols-1 gap-4">
            <div class="form-group">
                <label class="block text-gray-300 mb-2">Player Name</label>
                <input type="text" class="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-400 focus:outline-none" required>
            </div>
            <div class="form-group">
                <label class="block text-gray-300 mb-2">Free Fire UID</label>
                <input type="text" class="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-400 focus:outline-none" required>
            </div>
            <div class="form-group">
                <label class="block text-gray-300 mb-2">WhatsApp Number</label>
                <input type="tel" class="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-400 focus:outline-none" required>
            </div>
        </div>
    `;

    memberCard.querySelector('.remove-member').addEventListener('click', () => {
        memberCard.remove();
        memberCount--;
        addMemberButton.style.display = 'block';
    });

    membersContainer.appendChild(memberCard);
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
        return;
    }

    try {
        // Collect form data
        const formData = new FormData();
        
        // Add tournament data
        const selectedTournament = document.querySelector('.tournament-card.selected');
        formData.append('tournamentId', selectedTournament.dataset.id);
        formData.append('tournamentName', selectedTournament.querySelector('h3').textContent);
        
        // Add team data
        formData.append('teamName', document.querySelector('#step2 input[type="text"]').value);
        const teamLogo = document.querySelector('#step2 input[type="file"]').files[0];
        if (teamLogo) {
            formData.append('teamLogo', teamLogo);
        }
        
        // Add member data
        const members = [];
        document.querySelectorAll('.member-card').forEach(card => {
            const inputs = card.querySelectorAll('input');
            members.push({
                name: inputs[0].value,
                uid: inputs[1].value,
                whatsapp: inputs[2].value
            });
        });
        formData.append('members', JSON.stringify(members));
        
        // Add payment data
        formData.append('upiId', document.querySelector('#step4 input[placeholder="username@upi"]').value);
        formData.append('transactionId', document.querySelector('#step4 input[type="text"]:last-child').value);

        // Send data to server
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showSuccess();
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        showError('Registration failed. Please try again.');
        console.error('Registration error:', error);
    }
});

// Tournament selection
document.querySelectorAll('.tournament-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.tournament-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// Show success modal
function showSuccess() {
    successModal.classList.remove('hidden');
    successModal.classList.add('flex');
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Initialize first step
showStep(1);
