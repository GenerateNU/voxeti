import { Container, Box } from "@mui/material";
import { useRouter } from "@tanstack/react-router";

export default function ConfirmationPage() {
    const router = useRouter()
    console.log(router.state);
    console.log(router.state.location.state);
    return (
        <Container>
            <Box>
                <div className="text-xl font-semibold">Confirmation</div>
                <div className="text-sm text-[#777777] mb-6">
                    Please review your order!
                </div>
            </Box>
        </Container>
    )
}