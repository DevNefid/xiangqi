const session_id = localStorage.getItem('session-id')

if (session_id === null) {
    const path = window.location.pathname

    if (path !== '/' && path !== '') {
        window.location.href = window.location.origin
    }
} else {
    const res = await fetch(`/api/session-exists?session-id=${session_id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }})
    if (!res.ok) {
        sessionStorage.setItem('error', 'failed to check session existence')
        window.location.href = window.location.origin + '/error'
    }

    const data = await res.json()
    if (data.exists) {
        const path = window.location.pathname

        if (path !== '/session') {
            window.location.href = window.location.origin + '/session'
        }
    } else {
        localStorage.removeItem('session-id')
        window.location.href = window.location.origin
    }
}