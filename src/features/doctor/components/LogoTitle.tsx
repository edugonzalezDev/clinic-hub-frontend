import { Activity } from "lucide-react";
import { useNavigate } from "react-router";

type Props = {
    title: string,
    description: string
}

const LogoTitle = (props: Props) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate("/doctor"); }}>
            <div
                className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center my-gradient-class"

            >
                <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-semibold">{props?.title ? props.title : "HealthConnect"} </h1>
                <p className="text-sm text-muted-foreground"> {props?.description ? props.description : "Portal de profesionales"} </p>
            </div>
        </div>
    )
}

export default LogoTitle