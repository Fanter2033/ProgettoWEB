function List() {
  let fruitList = ["apple", "watermelon", "grapes", "strawberry", "orange"];

  const displayList = () => {
    return fruitList.map((fruit) => (
      <li key={fruit} className="list-group-item">
        {fruit}
      </li>
    ));
  };

  function findApple(){
    if (fruitList.includes('apple')){
        return fruitList.map(('apple') => (
            <li key='apple' className="list-group-item">
              apple
            </li>
          ));
    }
  }

  return (
    <>
      <h1> Badass Fruits </h1>
      <ul className="list-group">{displayList()}</ul>
    </>
  );
}

export default List;
