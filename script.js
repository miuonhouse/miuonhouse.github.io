// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Google Sheets Integration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7UU6Tuh3jIG_Ou68Fu3Oca8uWR8RfKAgG-O5dkH_BtbEKbCCsGnPX02aWRpm1kp4tHg/exec';
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.style.opacity = '0.7';

        const formData = new FormData(bookingForm);
        // Convert FormData to URLSearchParams for better compatibility with Apps Script e.parameter
        const params = new URLSearchParams();
        for (const [key, value] of formData) {
            params.append(key, value);
        }

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requires no-cors for simple POST
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
            .then(() => {
                // Note: with no-cors, we can't actually see the response body,
                // but if it doesn't throw, the request was at least sent.
                const roomTypeSelect = document.getElementById('room-type');
                const roomType = roomTypeSelect.options[roomTypeSelect.selectedIndex].text;

                alert(`Cảm ơn bạn! Yêu cầu đặt phòng "${roomType}" của bạn đã được gửi thành công. MiUon House sẽ liên hệ với bạn sớm nhất qua số điện thoại/email bạn đã cung cấp.`);

                bookingForm.reset();
            })
            .catch(error => {
                console.error('Submission error:', error);
                alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.opacity = '1';
            });
    });
}

// Intersaction Observer for reveal animations
const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(revealCallback, revealOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.8s ease-out";
    observer.observe(section);
});
