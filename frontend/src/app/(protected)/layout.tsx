export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            Layout Protetto
            {children}
        </div>
    );
}