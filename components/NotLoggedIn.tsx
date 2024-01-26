const NotLoggedIn = () => {
    return (
        <div className="w-full text-center ml-auto mr-auto flex flex-col">
            <span className="font-bold text-xl">You are not logged in!</span>
            <span className="font-medium text-lg">To access this page you need to login using Steam.</span>
            <span className="font-light text-sm">(You have a login button in the head of the page)</span>
        </div>
    )
}

export default NotLoggedIn;