import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
            <div className="mb-4">
                <Settings className="w-24 h-24 text-primary mb-2" />
            </div>
            
            <h1 className="text-[10rem] font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent md:text-[6rem]">
                404
            </h1>
            
            <h2 className="text-2xl text-muted-foreground mb-2">
                Page Not Found
            </h2>
            
            <p className="text-muted-foreground max-w-[600px] mb-8">
                The page you are looking for might have been removed, had its name changed, 
                or is temporarily unavailable. Please check the URL or return to the dashboard.
            </p>
            
            <Button 
                size="lg"
                onClick={() => navigate('/')}
                className="font-bold rounded-md px-8 py-6 shadow-md hover:shadow-lg"
            >
                Return to Dashboard
            </Button>
        </div>
    );
};

export default NotFoundPage;
