
import type { Meta, StoryObj } from '@storybook/react';

import type { TaskData } from '../types';

import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

import { Provider } from 'react-redux';

import { configureStore, createSlice } from '@reduxjs/toolkit';

// A super-simple mock of the state of the store
export const MockedState = {
    tasks: [
        { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
        { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
        { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
        { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
        { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
        { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
    ] as TaskData[],
    status: 'idle',
    error: null,
};

// A super-simple mock of a redux store
const Mockstore = ({
    taskboxState,
    children,
}: {
    taskboxState: typeof MockedState;
    children: React.ReactNode;
}) => (
    <Provider
        store={configureStore({
            reducer: {
                taskbox: createSlice({
                    name: "taskbox",
                    initialState: taskboxState,
                    reducers: {
                        updateTaskState: (state, action) => {
                            const { id, newTaskState } = action.payload;
                            const task = state.tasks.findIndex((task) => task.id === id);
                            if (task >= 0) {
                                state.tasks[task].state = newTaskState;
                            }
                        },
                    },
                }).reducer,
            },
        })}
    >
        {children}
    </Provider>
);

const meta = {
    component: TaskList,
    title: 'TaskList',
    decorators: [(story) => <div style={{ margin: '3rem' }}>{story()}</div>],
    tags: ['autodocs'],
    excludeStories: /.*MockedState$/, // 因為我們在這個檔案中定義 MockedState 且 export 了，所以需要排除它
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    decorators: [
        (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
    ],
};

export const WithPinnedTasks: Story = {
    decorators: [
        (story) => {
            const pinnedtasks: TaskData[] = [
                ...MockedState.tasks.slice(0, 5),
                { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
            ];

            return (
                <Mockstore
                    taskboxState={{
                        ...MockedState,
                        tasks: pinnedtasks,
                    }}
                >
                    {story()}
                </Mockstore>
            );
        },
    ],
};

export const Loading: Story = {
    decorators: [
        (story) => (
            <Mockstore
                taskboxState={{
                    ...MockedState,
                    status: 'loading',
                }}
            >
                {story()}
            </Mockstore>
        ),
    ],
};

export const Empty: Story = {
    decorators: [
        (story) => (
            <Mockstore
                taskboxState={{
                    ...MockedState,
                    tasks: [],
                }}
            >
                {story()}
            </Mockstore>
        ),
    ],
};