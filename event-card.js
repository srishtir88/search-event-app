function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); 
        event.currentTarget.click();
    }
} 