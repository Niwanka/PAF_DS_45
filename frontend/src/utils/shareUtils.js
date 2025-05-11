export const sharePost = async (post) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: post.title,
                text: post.content,
                url: window.location.href
            });
            return true;
        } catch (error) {
            console.error('Error sharing:', error);
            return false;
        }
    } else {
        // Fallback for browsers that don't support native sharing
        const shareUrl = window.location.href;
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = shareUrl;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        return 'copied';
    }
};