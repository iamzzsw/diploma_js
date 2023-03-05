export const getUsers = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    return response.json();
}

export const renderUser = (userArr, user) => {
    userArr.forEach((userObj) => {
        user.innerHTML += `
        <option>${userObj.username}</option>
        `
    })
}