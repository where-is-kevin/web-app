// src/app/AuthCheck.tsx
'use client'; // This makes it a client component


const AuthCheck = ({children}: { children: React.ReactNode }) => {
    return <>
            {children}
    </>; // Render children only after the check
};

export default AuthCheck;
