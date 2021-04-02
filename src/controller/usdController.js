
const getAverage = async (req, reply) => {
  const response = [
    {
      " buy_price " : 140.3 ,
      " sell_price " : 144 ,
      " source " : " https://www.ambito.com/contenidos/dolar.html "
    }
  ];
  reply.status(200).send(response);
};

export default { getAverage };
