import homelogo from '../assets/home.jpg'


export default function Landing() {

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "2rem" }}>
        <img src={homelogo} style={{ width: '100%', height: 'auto' }} alt="bmc" />
      </div>
    </div>
  );
}

