import { useEffect } from 'react';
import { useComponentStore } from '@/store/componentStore';
import { EntityId } from '@/core/types/EntityTypes';
import { Bindings } from '@/components/base/interactive/types';

/**
 * Hook to manage component bindings for interactive elements
 * Handles registration of internal and external bindings
 */
export function useInteractiveBindings({
    instanceId,
    bindings
}: {
    instanceId?: EntityId;
    bindings?: Bindings;
}) {
    const registerInstanceBinding = useComponentStore(
        (state) => state.registerInstanceBinding
    );

    // Register bindings when the component mounts or when bindings change
    useEffect(() => {
        if (!instanceId || !bindings) return;

        // Register internal bindings
        Object.entries(bindings.internalBindings || {}).forEach(
            ([path, config]) => {
                registerInstanceBinding(instanceId, path, config);
            }
        );

        // Register external bindings
        Object.entries(bindings.externalBindings || {}).forEach(
            ([path, config]) => {
                registerInstanceBinding(instanceId, path, config);
            }
        );
    }, [instanceId, bindings, registerInstanceBinding]);

    // Return nothing - this hook is for side-effects only
    return null;
}

export default useInteractiveBindings;