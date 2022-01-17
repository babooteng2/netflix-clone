import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  background-color: red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;
const Slider = styled(motion.div)`
  position: relative;
  top: -13rem;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)`
  background-color: white;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  img {
    width: 100%;
    height: 100%;
  }
`;
const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
  width: 40vw;
  height: 40vh;
  background-size: cover;
  background-repeat: no-repeat;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  padding: 20px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
`;
const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    transition: {
      delay: 0.2,
      duration: 0.2,
      y: -50,
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.2,
      y: -50,
    },
  },
};
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -(window.outerWidth - 5),
  },
};
const offset = 6;
function Home() {
  const history = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (!data) return;
    if (leaving) return;
    toggleLeaving();
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (moiveId: number) => {
    history(`/movies/${moiveId}`);
  };
  const onOverlayClick = () => history(-1);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {" "}
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[1].backdrop_path || "")}>
            <Title>{data?.results[1].title}</Title>
            <Overview>{data?.results[1].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}>
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}>
                      <img src={makeImagePath(movie.backdrop_path, "w500")} alt={movie.title} />
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 50 }}>
                  {clickedMovie ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  ) : null}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
