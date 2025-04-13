import AddComment from './components/AddComment';
import CommentsList from './components/CommentList';
import DefaultQuery from './components/DefaultQuery';

function App() {
  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <AddComment />
      <CommentsList />
      <DefaultQuery />
    </main>
  )
}

export default App;


