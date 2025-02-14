import { EditIcon } from "../../icons";
import { DropdownButton } from "../Dropdown";

const ProjectHeader = () => {
    const projectName = "Name of Project";
    return (
        <article>
            <DropdownButton
                label={projectName}
                options={[
                    {
                        label: "Change Project Name",
                        value: "Change Project Name",
                        icon: <EditIcon />,
                        onClick: () => {},
                    },
                    {
                        label: "Change Project Name2",
                        value: "Change Project Name2",
                        icon: <EditIcon />,
                        onClick: () => {},
                    },
                ]}
            />
        </article>
    );
};

export default ProjectHeader;
