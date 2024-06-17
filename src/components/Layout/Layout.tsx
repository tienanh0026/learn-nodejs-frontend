import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <main className="size-full bg-gray-50 h-svh p-12">
            <div className="border-gray- bg-gray-200 rounded-lg h-full shadow-[rgba(0,0,0,0.24)_0px_3px_8px] p-6">
                <Outlet />
            </div>
        </main>
    );
}

export default Layout;
