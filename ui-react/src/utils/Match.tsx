import React from 'react'
import {State} from 'xstate'
interface MatchProps {
  state: string | string[]
  current: State<any,any>
}
const Match: React.FC<MatchProps>=({
  children,state,current
}) => {
  const expected = Array.isArray(state) ? state : [state]

  //This enables us to show the screen in the background while the cancel overlay is showing
  const showWhileCancelling = 
    current.matches('cancelling') &&
    current.history &&
    expected.some((value) => current.history!.matches(value))
  return expected.some((value)=> current.matches(value)) || showWhileCancelling ? (
    <>{children}</>
  ) : null
  }

export default Match