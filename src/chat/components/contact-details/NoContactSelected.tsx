
export const NoContactSelected = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full bg-muted/20 p-8 rounded-xl shadow-lg'>
        <div className='flex items-center mb-6'>
            <svg className='h-10 w-10 text-primary mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            <h1 className='text-3xl font-bold text-center text-primary'>No contact selected</h1>
        </div>
        <p className='text-base text-muted-foreground text-center mb-4'>Select a contact to start a conversation</p>
    </div>
  )
}
