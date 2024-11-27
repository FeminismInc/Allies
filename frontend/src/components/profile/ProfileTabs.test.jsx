

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileTabs from './ProfileTabs';
import UserPost from '../../components/post/userPost';
import PostContent from '../../components/post/postContent';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { it, vi, describe, beforeEach, expect } from 'vitest';

// Mock axios and child components
vi.mock('axios');
vi.mock('../../components/post/userPost', () => ({
  __esModule: true,
  default: vi.fn(() => <div>Mocked UserPost</div>),
}));
vi.mock('../../components/post/postContent', () => ({
  __esModule: true,
  default: vi.fn(() => <div>Mocked PostContent</div>),
}));

describe('ProfileTabs Component', () => {
  const username = 'testuser';
  const mockPosts = [
    { id: 1, author: 'testuser', datetime: '2023-11-23T12:00:00Z', text: 'Test Post 1' },
    { id: 2, author: 'testuser', datetime: '2023-11-23T14:00:00Z', text: 'Test Post 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render "posts" tab as active by default and fetch posts', async () => {
    // Arrange
    axios.get.mockResolvedValueOnce({ data: mockPosts });

    // Act
    render(
      <MemoryRouter>
        <ProfileTabs username={username} />
      </MemoryRouter>
    );

    // Assert
    const postsTab = screen.getByRole('button', { name: /posts/i });
    expect(postsTab).toHaveClass('active');

    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          `http://localhost:5050/api/users/getPosts/${username}`,
          expect.objectContaining({})
        );
      });

    // Ensure UserPost is rendered for each post
    expect(UserPost).toHaveBeenCalledTimes(mockPosts.length);
    expect(UserPost).toHaveBeenCalledWith(
      expect.objectContaining({ post: mockPosts[0], username }),
      {}
    );
    expect(UserPost).toHaveBeenCalledWith(
      expect.objectContaining({ post: mockPosts[1], username }),
      {}
    );
  });   
      
    
      it('should display "No posts found" if there are no posts', async () => {
        // Arrange
        axios.get.mockResolvedValueOnce({ data: [] });
    
        // Act
        render(
          <MemoryRouter>
            <ProfileTabs username={username} />
          </MemoryRouter>
        );
    
        // Assert
        const postsTab = screen.getByRole('button', { name: /posts/i });
        fireEvent.click(postsTab);
    
        await waitFor(() => expect(screen.getByText('No posts found.')).toBeInTheDocument());
      });
    
    
//     it('should switch to media tab and render media content', () => {
//         //arrange
//         render(
//             <MemoryRouter>
//               <ProfileTabs username={username} />
//             </MemoryRouter>
//           );
//         const mediaTab = screen.getByRole('button', { name: /media/i });

//         //act
//         fireEvent.click(mediaTab);

//         //assert
//         expect(screen.getByText('Lex_the_cat')).toBeInTheDocument();
//         expect(screen.getByAltText('Media')).toBeInTheDocument();
//        // expect(mediaTab.className).toContain('active')
//         // 
//        // expect(screen.getByText('Lex_the_cat')).toBeInTheDocument();
//   });
    

   
     it('should call fetchPostsByUsername only when the posts tab is active', async () => {
        // Act
        render(
          <MemoryRouter>
            <ProfileTabs username="" />
          </MemoryRouter>
        );
    
        const postsTab = screen.getByRole('button', { name: /posts/i });
        fireEvent.click(postsTab);
    
        // Assert
        expect(axios.get).not.toHaveBeenCalled();
      });
    });

