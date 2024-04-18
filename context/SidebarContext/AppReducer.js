export default function SidebarReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        show: !state.show,
      }

    default:
      return state
  }
}
