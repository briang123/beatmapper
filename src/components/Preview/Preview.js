import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import useScrollThroughSong from '../../hooks/use-scroll-through-song.hook';

import ReduxForwardingCanvas from '../ReduxForwardingCanvas';
import EditorBottomPanel from '../EditorBottomPanel';

// import KeyboardShortcuts from './KeyboardShortcuts';
import LightingPreview from './LightingPreview';

const Preview = ({ isPlaying, pausePlaying, scrollThroughSong }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      // On unmount, pause the track
      pausePlaying();
    };
  }, [pausePlaying]);

  useScrollThroughSong(canvasRef, isPlaying, scrollThroughSong);

  return (
    <Wrapper>
      <ReduxForwardingCanvas ref={canvasRef}>
        <LightingPreview />
      </ReduxForwardingCanvas>

      <EditorBottomPanel />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #000;
  width: 100%;
  height: 100%;
`;

const mapStateToProps = state => ({
  isPlaying: state.navigation.isPlaying,
});

const mapDispatchToProps = {
  pausePlaying: actions.pausePlaying,
  scrollThroughSong: actions.scrollThroughSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preview);
