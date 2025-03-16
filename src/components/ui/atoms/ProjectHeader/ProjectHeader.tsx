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
                ]}
            />
        </article>
    );
};

export default ProjectHeader;
