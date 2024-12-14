const fetchData = async (page) => {
    const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data = await res.json();
    return data.results; // Karakterlerin sadece sonuç kısmını döndür
  };
  
  export default fetchData;
  