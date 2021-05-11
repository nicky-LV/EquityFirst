import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import {QueryClientProvider, QueryClient} from "react-query";
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
                    <ToastProvider>
                        <App />
                    </ToastProvider>
            </QueryClientProvider>
        </Provider>
    )
}

export default MyApp
