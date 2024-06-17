import { getCurrentUser } from "@modules/api/currentUser";
import { useEffect } from "react";

function HomePage() {
    useEffect(() => {
        getCurrentUser().then((response) => {
            console.log(response);
        });
    });
    return <></>;
}

export default HomePage;
