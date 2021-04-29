import '../styles/globals.css'
import {ChakraProvider} from "@chakra-ui/react";
import {QueryClientProvider, QueryClient} from "react-query";
import chakraTheme from "../styles/chakraTheme";
import {Provider} from "react-redux";
import store from "../redux/store";
import App from "../components/app";
import {ToastProvider} from "react-toast-notifications";

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css'

// Creates query client
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider theme={chakraTheme}>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </ChakraProvider>
            </QueryClientProvider>
        </Provider>
    )
}

export default MyApp
