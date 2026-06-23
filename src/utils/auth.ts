export function isGuest(): boolean {
    return localStorage.getItem('userRole') === 'guest';
}

export function isUser(): boolean {
    return localStorage.getItem('userRole') === 'user';
}