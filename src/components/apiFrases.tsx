// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './style.css';

// interface Phrase {
//   id: number;
//   text: string;
// }

// const FraseMotivacional: React.FC = () => {
//   const [phrases, setPhrases] = useState<Phrase[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   useEffect(() => {
//     const fetchPhrases = async () => {
//       try {
//         const response = await axios.get<Phrase[]>('https://phrase-api.vercel.app/api/list/all');
//         setPhrases(response.data);
//         console.log(response, 'eoem felas')
//       } catch (error) {
//         console.error('Erro ao buscar frases:', error);
//       }
//     };
//     fetchPhrases();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prev => (phrases.length > 0 ? (prev + 1) % phrases.length : 0));
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [phrases]);

//   return (
//     <div className="phrase-ticker" >
//       <div className="phrase" >
//         {phrases.length > 0 ? phrases[currentIndex].text : 'Carregando frases...'}
//       </div>
//     </div>
//   );
// };

// export default FraseMotivacional;