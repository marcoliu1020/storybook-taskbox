import type { Meta, StoryObj } from '@storybook/react';

import InboxScreen from './InboxScreen';

import store from '../lib/store';

import { http, HttpResponse } from 'msw';

import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

import {
    expect,
    fireEvent,
    userEvent,
    waitFor,
    waitForElementToBeRemoved,
    within
} from '@storybook/test';

const meta = {
    component: InboxScreen,
    title: 'InboxScreen',
    decorators: [(story) => <Provider store={store}>{story()}</Provider>],
    tags: ['autodocs'],
} satisfies Meta<typeof InboxScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('https://jsonplaceholder.typicode.com/todos?userId=1', async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return HttpResponse.json(MockedState.tasks);
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Waits for the component to transition from the loading state
        await waitForElementToBeRemoved(await canvas.findByTestId('loading'), { timeout: 2000 });
        
        // marco's test
        const pinTaskButton = canvas.getByRole('button', { name: 'pinTask-1' });
        await expect(pinTaskButton).toBeInTheDocument();
        await userEvent.click(pinTaskButton);
        
        const pinTaskButton2 = canvas.getByRole('button', { name: 'pinTask-2' });
        await expect(pinTaskButton2).toBeInTheDocument();
        await userEvent.click(pinTaskButton2);
        
        const pinnedTask = canvas.getByTestId('success');
        await expect(pinnedTask).toBeInTheDocument();
        await expect(pinnedTask.querySelectorAll('.TASK_PINNED')).toHaveLength(2);
        
        return
        // marco's test end
       
        // tutorial test
        // Waits for the component to be updated based on the store
        await waitFor(async () => {
            // Simulates pinning the first task
            // await fireEvent.click(await canvas.findByRole('button', { name: 'pinTask-1' })); // same as canvas.getByLabelText('pinTask-1')
            await fireEvent.click(canvas.getByRole('button', { name: 'pinTask-1' })); // same as canvas.getByLabelText('pinTask-1')
            // Simulates pinning the third task
            await fireEvent.click(canvas.getByLabelText('pinTask-3'));
        });
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
                    return new HttpResponse(null, {
                        status: 403,
                    });
                }),
            ],
        },
    },
};
