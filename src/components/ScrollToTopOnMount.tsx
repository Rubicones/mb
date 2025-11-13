"use client";

import { useEffect } from "react";

export default function ScrollToTopOnMount() {
    useEffect(() => {
        // Ensure the page starts at the top when the project detail view finishes loading.
        window.scrollTo({
            top: 0,
            behavior: "auto",
        });
    }, []);

    return null;
}


