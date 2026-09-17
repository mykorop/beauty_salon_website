document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        const res = await fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        });
        
        if (!res.ok) throw new Error('Failed');
        
        btn.textContent = 'Sent!';
        this.reset();
    } catch {
        btn.textContent = 'Error — Try again';
    }

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
});
