import { EditIcon } from "../../icons";
import { DropdownButton, DropdownSelect } from "../Dropdown";

const ProjectHeader = () => {
    const projectName = "Name of Project";
    return (
        <article>
            <DropdownButton
                label={projectName}
                variant="default"
                closeOnMouseLeave={true}
                options={[
                    {
                        label: "Change Project Name",
                        value: "Change Project Name",
                        icon: <EditIcon />,
                        onClick: () => {
                            console.log("HERE1");
                        },
                    },
                    {
                        label: "Change Project Name2",
                        value: "Change Project Name2",
                        icon: <EditIcon />,
                        onClick: () => {
                            console.log("HERE2");
                        },
                    },
                ]}
            />
            <DropdownSelect
                label={projectName}
                variant="default"
                options={[
                    {
                        label: "Change Project Name",
                        value: "Change Project Name",
                        icon: <EditIcon />,
                        onClick: () => {
                            console.log("HERE1");
                        },
                    },
                    {
                        label: "Change Project Name2",
                        value: "Change Project Name2",
                        icon: <EditIcon />,
                        onClick: () => {
                            console.log("HERE2");
                        },
                    },
                ]}
            />
        </article>
    );
};

export default ProjectHeader;
