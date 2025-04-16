import homelogo from '../assets/home.jpg'


export default function Landing() {

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "2rem"}}>
        <img src={homelogo} width={2250} height={550} alt="bmc" />
      </div>
    </div>
  );
}

