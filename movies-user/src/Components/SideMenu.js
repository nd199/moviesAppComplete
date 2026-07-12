import { Link } from 'react-router-dom';

const SideMenu = ({ title, stuff }) => (
  <div className="flex flex-col gap-3">
    {title && <h1 className="text-lg font-bold text-white m-0">{title}</h1>}
    <ul className="flex flex-col gap-1 list-none p-0 m-0">
      {stuff?.map((item, i) => (
        <li key={i}>
          {item.link ? (
            <Link to={item.link} className="flex items-center gap-3 p-3 rounded-xl text-[#8892b0] no-underline hover:text-white hover:bg-white/5 transition-all text-sm">
              <span className="text-brand-400">{item.icon}</span> {item.name}
            </Link>
          ) : (
            <div className="flex items-center gap-3 p-3 text-[#8892b0] text-sm">
              <span className="text-brand-400">{item.icon}</span> {item.name}
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default SideMenu;
