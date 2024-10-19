import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TopicService from '../../Service/TopicService';

const TrashTopic = () => {
    const [topics, setTopics] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                // Fetch topics in the trash (assuming you have a service method for this)
                const result = await TopicService.getListTrash();
                setTopics(result.topics);
            } catch (err) {
                console.error("Error fetching topics from trash:", err);
                setError(err);
            }
        };

        fetchTopics();
    }, []);

    const handleMoveToTrash = async (id) => {
        if (window.confirm("Are you sure you want to move this topic to trash?")) {
            try {
                // Call API to update the status of the topic to 2 (trash)
                await TopicService.updateStatus(id, { status: 2 });
                // Update state to reflect the change
                setTopics(topics.filter(topic => topic.id !== id));
            } catch (err) {
                console.error("Error moving topic to trash:", err);
                setError(err);
            }
        }
    };

    return (
        <div>
            {error && <div className="text-red-500">{error.message}</div>}
            <div className="w-full">
                <table id="example1" className="min-w-full bg-white border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">STT</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Id</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Name</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Description</th>
                            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <tr key={topic.id}>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{topic.id}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{topic.name}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{topic.description}</td>
                                    <td className="px-14 py-4 border-b text-sm text-gray-900">
                                        <Link
                                            to={`/topic/edit/${topic.id}`}
                                            className="mr-2 px-4 py-2 text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <Link
                                            className="px-4 py-2 text-red-500 hover:text-red-700"
                                            onClick={() => handleMoveToTrash(topic.id)}
                                        >
                                            <FaTrash />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No topics found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrashTopic;
