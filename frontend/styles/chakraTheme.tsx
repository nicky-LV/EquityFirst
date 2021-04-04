import { extendTheme } from "@chakra-ui/react"
const chakraTheme = extendTheme(
    {colors: {
            sidebar: "#202A35",
            navbar: "#001529",
            background: "#F0F2F5",
            card: "#FFFFFF",
            blue: "#4FA0D8",
            gray: {
                50: "#F7FAFC",
                100: "#EDF2F7",
                200: "#E2E8F0",
                300: "#CBD5E0",
                400: "#A0AEC0"
            },
            red: {
                300: "#FC8181",
                400: "#F56565",
                500: "#E53E3E"
            },
            green: {
                300: "#68D391",
                400: "#48BB78",
                500: "#38A169"
            }
        }

    })


export default chakraTheme