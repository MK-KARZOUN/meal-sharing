import "./error.css";
const Error = () => {
  return (
    <div className="Error">
      <img src="https://t3.ftcdn.net/jpg/01/35/88/24/360_F_135882430_6Ytw6sJKC5jg8ovh18XjAHuMXcS7mlai.jpg" alt="404 page" className="image" />
      <div className="overlay">
        <p className="message">Please try again later.</p>
      </div>
    </div>
  );
};

export default Error;
