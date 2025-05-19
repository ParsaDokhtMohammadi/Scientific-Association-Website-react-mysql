import { useGetEventsQuery } from './services/ApiSlice';
import './App.css';

function App() {
  const { data: Events, isLoading, isError, error } = useGetEventsQuery();
  console.log('Events:', Events, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.data?.details || error.message}</div>;

  return (
    <>
      <h1>Events</h1>
      <button onClick={() => console.log(Events)}>Log Events</button>
      <ul>
        {Events?.data?.length > 0 ? (
          Events.data.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))
        ) : (
          <li>No events found</li>
        )}
      </ul>
    </>
  );
}

export default App;