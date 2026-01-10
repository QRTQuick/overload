// Overload Frontend JavaScript - Live API Integration
const API_BASE_URL = 'https://overload-api.onrender.com';

// DOM Elements
let codeInput, resultsContainer, loadingOverlay;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Get DOM elements
    codeInput = document.getElementById('codeInput');
    resultsContainer = document.getElementById('resultsContainer');
    loadingOverlay = document.getElementById('loadingOverlay');

    // Welcome voice message for desktop
    playWelcomeMessage();

    // Character counter
    if (codeInput) {
        codeInput.addEventListener('input', updateCharCount);
        updateCharCount();
    }

    // Load example code on page load
    loadExample();

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Circular menu toggle with trigonometry
    const centerBtn = document.getElementById('circularBtn');
    const items = document.querySelectorAll('.nav-item');

    let open = false;
    // Adjust radius based on screen size
    const radius = window.innerWidth <= 768 ? 70 : 80;

    if (centerBtn && items.length > 0) {
        centerBtn.addEventListener('click', function() {
            open = !open;
            centerBtn.classList.toggle('active');

            items.forEach((item, index) => {
                // Calculate angle for each item (evenly distributed)
                const angle = (2 * Math.PI / items.length) * index;

                // Calculate x and y positions using trigonometry
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                if (open) {
                    // Add slight delay for staggered animation effect
                    setTimeout(() => {
                        item.style.transform = `translate(${x}px, ${y}px)`;
                        item.style.opacity = '1';
                    }, index * 50);
                } else {
                    // Return items to center (hidden) with slight delay
                    setTimeout(() => {
                        item.style.transform = `translate(-50%, -50%)`;
                        item.style.opacity = '0';
                    }, index * 30);
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const radialNav = document.querySelector('.radial-nav');
            if (!radialNav.contains(e.target) && open) {
                open = false;
                centerBtn.classList.remove('active');

                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = `translate(-50%, -50%)`;
                        item.style.opacity = '0';
                    }, index * 30);
                });
            }
        });

        // Close menu when clicking menu items
        items.forEach(item => {
            item.addEventListener('click', function() {
                open = false;
                centerBtn.classList.remove('active');

                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = `translate(-50%, -50%)`;
                        item.style.opacity = '0';
                    }, index * 30);
                });
            });
        });
    }

    // Bubble Bottom Navigation
    const bubbleItems = document.querySelectorAll('.bubble-nav .nav-item');

    if (bubbleItems.length > 0) {
        bubbleItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                bubbleItems.forEach(i => i.classList.remove('active'));

                // Add active class to clicked item
                this.classList.add('active');

                // Smooth scroll to corresponding section
                const sectionId = this.getAttribute('data-section');
                if (sectionId) {
                    const targetElement = document.getElementById(sectionId) || document.querySelector(`[id="${sectionId}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }

                // Add haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });

        // Update active state based on scroll position
        function updateActiveBubbleOnScroll() {
            const sections = ['analyzer', 'features', 'testimonials', 'docs', 'contact'];
            const scrollPosition = window.scrollY + 100; // Offset for navbar

            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId) || document.querySelector(`[id="${sectionId}"]`);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        // Remove active from all
                        bubbleItems.forEach(item => item.classList.remove('active'));

                        // Add active to corresponding nav item
                        const activeItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
                        if (activeItem) {
                            activeItem.classList.add('active');
                        }
                    }
                }
            });
        }

        // Listen for scroll events
        window.addEventListener('scroll', updateActiveBubbleOnScroll);

        // Initial check
        updateActiveBubbleOnScroll();
    }

    // Hamburger Menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNavMenu = document.getElementById('mobileNavMenu');

    if (hamburgerBtn && mobileNavMenu) {
        let menuOpen = false;

        hamburgerBtn.addEventListener('click', function() {
            menuOpen = !menuOpen;
            hamburgerBtn.classList.toggle('active');
            mobileNavMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburgerBtn.contains(e.target) && !mobileNavMenu.contains(e.target) && menuOpen) {
                menuOpen = false;
                hamburgerBtn.classList.remove('active');
                mobileNavMenu.classList.remove('active');
            }
        });

        // Close menu when clicking menu items
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', function() {
                menuOpen = false;
                hamburgerBtn.classList.remove('active');
                mobileNavMenu.classList.remove('active');
            });
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to analyze
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            analyzeCode();
        }
        
        // Ctrl/Cmd + K to clear
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            clearCode();
        }
    });
}

function updateCharCount() {
    const charCount = document.querySelector('.char-count');
    if (charCount && codeInput) {
        const count = codeInput.value.length;
        charCount.textContent = `${count} characters`;
        
        // Color coding for length
        if (count > 45000) {
            charCount.style.color = '#ef4444';
        } else if (count > 30000) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#64748b';
        }
    }
}

// Welcome voice message for desktop
function playWelcomeMessage() {
    // Only play on desktop (screen width > 768px)
    if (window.innerWidth > 768 && 'speechSynthesis' in window) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance('Welcome to Overload');
            utterance.rate = 0.8; // Slightly slower
            utterance.pitch = 1; // Normal pitch
            utterance.volume = 0.7; // Not too loud
            
            // Try to use a nice voice if available
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') || 
                voice.name.includes('Victoria')
            );
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            speechSynthesis.speak(utterance);
        }, 1000); // 1 second delay
    }
}

function scrollToAnalyzer() {
    const analyzer = document.getElementById('analyzer');
    if (analyzer) {
        analyzer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function loadExample() {
    const exampleCode = `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)  # Bug: Division by zero if empty list

def unsafe_eval(user_input):
    return eval(user_input)  # Security vulnerability: Code injection

def process_data(data):
    if data == None:  # Should use 'is None'
        return []
    
    results = []
    for item in data:
        if item > 0:
            results.append(item * 2)
        else:
            results.append(item / 0)  # Runtime error: Division by zero
    
    return results

# Usage with bugs
numbers = []
average = calculate_average(numbers)  # Will crash
print(f"Average: {average}")

user_code = input("Enter code: ")
result = unsafe_eval(user_code)  # Dangerous!

data = None
processed = process_data(data)`;

    if (codeInput) {
        codeInput.value = exampleCode;
        updateCharCount();
    }
}

function clearCode() {
    if (codeInput) {
        codeInput.value = '';
        updateCharCount();
        showPlaceholder();
    }
}

function showPlaceholder() {
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results-placeholder">
                <i class="fas fa-code"></i>
                <p>Enter Python code above and click "Analyze Code" to see results</p>
            </div>
        `;
    }
}

async function analyzeCode() {
    const code = codeInput?.value?.trim();
    
    if (!code) {
        showNotification('Please enter some Python code to analyze', 'warning');
        return;
    }

    if (code.length > 50000) {
        showNotification('Code is too long. Maximum 50,000 characters allowed.', 'error');
        return;
    }

    showLoading(true);
    
    try {
        console.log('Sending request to:', `${API_BASE_URL}/analyze`);
        
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a minute.');
            } else if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Invalid code provided');
            } else if (response.status >= 500) {
                throw new Error('Server error. The service may be starting up. Please try again in 30 seconds.');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const result = await response.json();
        console.log('Analysis result:', result);
        displayResults(result);
        
    } catch (error) {
        console.error('Analysis error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Failed to fetch')) {
            showError('Cannot connect to the API. The service may be starting up. Please wait 30 seconds and try again.');
        } else {
            showError(error.message || 'Analysis failed. Please try again.');
        }
    } finally {
        showLoading(false);
    }
}

function displayResults(result) {
    const bugs = result.bugs || [];
    const analysisTime = result.analysis_time || 0;

    if (bugs.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-issues">
                <div style="text-align: center; padding: 2rem; color: #10b981;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No Issues Found! 🎉</h3>
                    <p>Your code looks clean. No bugs, security issues, or bad practices detected.</p>
                    <small style="color: #64748b;">Analysis completed in ${analysisTime.toFixed(2)}s</small>
                </div>
            </div>
        `;
        return;
    }

    const bugsHtml = bugs.map(bug => `
        <div class="bug-item ${bug.severity}">
            <div class="bug-header">
                <span class="bug-type">${escapeHtml(bug.type)}</span>
                <span class="bug-severity ${bug.severity}">${bug.severity}</span>
            </div>
            ${bug.line ? `<div class="bug-line"><i class="fas fa-map-marker-alt"></i> Line ${bug.line}</div>` : ''}
            <div class="bug-description">${escapeHtml(bug.description)}</div>
            <div class="bug-fix">
                <strong>💡 Fix:</strong> ${escapeHtml(bug.fix)}
            </div>
        </div>
    `).join('');

    const summary = getSummary(bugs);

    resultsContainer.innerHTML = `
        <div class="results-summary">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                <div>
                    <h4 style="margin: 0; color: #1a202c;">Found ${bugs.length} issue${bugs.length !== 1 ? 's' : ''}</h4>
                    <small style="color: #64748b;">Analysis completed in ${analysisTime.toFixed(2)}s</small>
                </div>
                <div style="display: flex; gap: 1rem; font-size: 0.875rem;">
                    ${summary.critical > 0 ? `<span style="color: #dc2626;"><i class="fas fa-exclamation-triangle"></i> ${summary.critical} Critical</span>` : ''}
                    ${summary.high > 0 ? `<span style="color: #ef4444;"><i class="fas fa-exclamation-circle"></i> ${summary.high} High</span>` : ''}
                    ${summary.medium > 0 ? `<span style="color: #f59e0b;"><i class="fas fa-exclamation"></i> ${summary.medium} Medium</span>` : ''}
                    ${summary.low > 0 ? `<span style="color: #10b981;"><i class="fas fa-info-circle"></i> ${summary.low} Low</span>` : ''}
                </div>
            </div>
        </div>
        <div class="bugs-list">
            ${bugsHtml}
        </div>
    `;

    showNotification(`Analysis complete! Found ${bugs.length} issue${bugs.length !== 1 ? 's' : ''}`, 'success');
}

function getSummary(bugs) {
    return bugs.reduce((acc, bug) => {
        acc[bug.severity] = (acc[bug.severity] || 0) + 1;
        return acc;
    }, {});
}

function showError(message) {
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="error-state">
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Analysis Failed</h3>
                    <p>${escapeHtml(message)}</p>
                    <button class="btn btn-primary" onclick="analyzeCode()" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

function showLoading(show) {
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add('show');
        } else {
            loadingOverlay.classList.remove('show');
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    notification.style.background = colors[type] || colors.info;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function exportResults() {
    const bugs = Array.from(document.querySelectorAll('.bug-item')).map(item => {
        const type = item.querySelector('.bug-type')?.textContent || '';
        const severity = item.querySelector('.bug-severity')?.textContent || '';
        const line = item.querySelector('.bug-line')?.textContent?.replace('Line ', '') || '';
        const description = item.querySelector('.bug-description')?.textContent || '';
        const fix = item.querySelector('.bug-fix')?.textContent?.replace('💡 Fix: ', '') || '';
        
        return { type, severity, line, description, fix };
    });

    if (bugs.length === 0) {
        showNotification('No results to export', 'warning');
        return;
    }

    const exportData = {
        timestamp: new Date().toISOString(),
        total_issues: bugs.length,
        code_analyzed: codeInput?.value || '',
        bugs: bugs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overload-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Results exported successfully!', 'success');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Test API connection on page load
window.addEventListener('load', async function() {
    try {
        console.log('Testing API connection...');
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            const health = await response.json();
            console.log('API is healthy:', health);
            showNotification('✅ Connected to Overload API', 'success');
        } else {
            console.warn('API health check failed:', response.status);
            showNotification('⚠️ API may be starting up. Please wait 30 seconds before analyzing.', 'warning');
        }
    } catch (error) {
        console.error('API connection test failed:', error);
        showNotification('⚠️ API connection issue. Service may be starting up.', 'warning');
    }
});