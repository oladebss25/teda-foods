export default function StorySection() {
  return (
    <section className="story-section">
      <div className="story-grid">
        <div>
          <h2 className="story-tagline">Real food.<br />No <em>shortcuts.</em></h2>
          <p className="story-body">
            We're a student-run kitchen at FUNAAB, Abeokuta. Every dish is made fresh every day — no reheated meals, no frozen proteins. Just honest, flavourful food made with care.
          </p>
        </div>
        <div>
          <ul className="steps-list">
            {[
              { num: '01', name: 'Pick your meal', desc: 'Browse the board above and tap items to add them to your tray.' },
              { num: '02', name: 'Fill your details', desc: 'Enter your name, phone number, and delivery or pickup location.' },
              { num: '03', name: 'We confirm on WhatsApp', desc: 'Your order goes straight to us. We\'ll confirm and get it ready fast.' },
            ].map((step) => (
              <li className="step-item" key={step.num}>
                <span className="step-num-badge">{step.num}</span>
                <div className="step-content">
                  <div className="step-name">{step.name}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
