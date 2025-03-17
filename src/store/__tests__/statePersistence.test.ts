// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { useUIStore } from '@/store/uiStore';
// import { useComponentStore } from '@/store/componentStore';
// import { BasePanel } from '@/components/ui/organisms/panels/BasePanel';

// // Helper function to clear localStorage before each test
// const clearLocalStorage = () => {
//     localStorage.clear();
// };

// describe('State Persistence with local storage', () => {
//     // Clear localStorage before each test
//     beforeEach(() => {
//         jest.clearAllMocks();
//         clearLocalStorage();
//     });

//     // As tests make sense (when components are made) they will be added here for specifically
//     // state persistence
//     // // Test 1: UI Store State Persistence
//     // it('UI Store state is persisted in localStorage', () => {
//     //     const setItemMock = jest.spyOn(Storage.prototype, 'setItem');
//     //     render(<BasePanel />);

//     //     userEvent.click(screen.getByRole('button', ));
//     // });
// });