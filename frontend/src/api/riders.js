// For Stage 2, we’ll use a mock in-memory list.
// In Stage 3, swap BASE_URL to your Express API and use real fetch calls.

let _riders = [
    { id: 1, full_name: 'Sam Greeff', email: 'sam@example.com', experience: 'novice' },
    { id: 2, full_name: 'Anele Nkosi', email: 'anele@example.com', experience: 'open' },
]

export async function listRiders() {
    // simulate network delay
    await new Promise(r => setTimeout(r, 400))
    return _riders
}

export async function createRider(payload) {
    await new Promise(r => setTimeout(r, 400))
    const newRider = { id: Date.now(), ...payload }
    _riders = [newRider, ..._riders]
    return newRider
}
