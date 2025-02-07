import { EditIcon } from "../../icons";
import { DropdownButton } from "../../shared/Dropdown";

const ProjectHeader = () => {
    const projectName = "Name of Project";
    return (
        <article>
            <DropdownButton
                label={projectName}
                options={[
                    {
                        label: 'Change Project Name',
                        value: 'Change Project Name',
                        icon: <EditIcon />,
                        onClick: () => { }
                    },
                ]}
                variant='ghost'
                className='w-full'
                size='sm'
            />
        </article>
    );
};

export default ProjectHeader;