import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  motion,
  useAnimation,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: black;
  height: 80px;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: white;
  }
`;
const Items = styled.ul`
  display: flex;
  align-items: center;
`;
const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;
const Search = styled.span`
  position: relative;
  color: white;
  display: flex;
  align-items: center;
  svg {
    height: 25px;
  }
`;
const Input = styled(motion.input)`
  position: absolute;
  right: 60px;
  transform-origin: right center;
  padding: 5px 20px 5px 40px;
  z-index: -1;
  color: white;
  background-color: transparent;
  font-size: 16px;
  border: 1px solid ${(props) => props.theme.white.lighter};
  width: 17rem;
  top: -3px;
  right: 0;
`;
const Circle = styled(motion.span)`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.red};
  top: -10px;
`;
const logoVariants: Variants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [1, 0, 1],
    opacity: [1, 0.5, 1],
    transition: {
      repeat: Infinity,
    },
  },
};
const navVariants = {
  top: { backgroundColor: "rgba(0,0,0,0)" },
  scroll: { backgroundColor: "rgba(0,0,0,1)" },
};
interface IForm {
  keyword: string;
}

function Header() {
  const history = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useViewportScroll();
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 250) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);
  const { register, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    console.log(data);
    history(`/search?keyword=${data.keyword}`);
  };
  return (
    <>
      <Nav initial={"top"} animate={navAnimation} variants={navVariants}>
        <Col>
          <Logo
            variants={logoVariants}
            whileHover="active"
            initial="normal"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676L44.051 119.724v151.073C28.647 272.418 14.594 274.58 0 276.742V0h41.08l56.212 157.021V0h43.511zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461V0h119.724v43.241h-76.482zm237.284-58.104h-44.862V242.15c-14.594 0-29.188 0-43.239.539V43.242h-44.862V0H463.22zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433V0h120.808v43.241h-78.375zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676V0h43.24zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242V0h-42.43zM1024 0l-54.863 131.615L1024 276.742c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75L871.576 0h46.482l28.377 72.699L976.705 0z" />
          </Logo>
          <Items>
            <Item>
              <Link to="/">Home</Link>
              {homeMatch && <Circle layoutId="circle" />}
            </Item>
            <Item>
              <Link to="/tv">Tv Shows</Link>
              {tvMatch && <Circle layoutId="circle" />}
            </Item>
          </Items>
        </Col>
        <form onSubmit={handleSubmit(onValid)} style={{ position: "relative" }}>
          <Search onClick={toggleSearch}>
            <motion.svg
              animate={{
                x: searchOpen ? "-15rem" : 0,
                transition: { type: "tween" },
              }}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </motion.svg>
          </Search>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "tween" }}
            type="text"
            placeholder="Search for moive or tv show"
          />
        </form>
      </Nav>
    </>
  );
}

export default Header;
