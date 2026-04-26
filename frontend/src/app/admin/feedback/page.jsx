"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Star, MessageSquare, User, Clock, Trash2, Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function FeedbackManagementPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("dropsync_token");
            const res = await axios.get("http://localhost:5000/api/reviews/dashboard-reviews", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (error) {
            toast.error("Failed to load feedback");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-blue-500" /> Feedback Management
                </h1>
                <p className="text-slate-400 mt-1">Monitor customer satisfaction and network performance.</p>
            </div>

            <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                    <h2 className="font-bold text-white text-lg flex items-center gap-2">
                        <Filter className="w-5 h-5 text-slate-400" /> Customer Reviews
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Rating</th>
                                <th className="px-6 py-4 font-semibold">Comment</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                        Loading feedback data...
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-white">
                                                <User className="w-4 h-4 text-slate-400" />
                                                {review.user?.name || "Deleted User"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{renderStars(review.rating)}</td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs truncate text-slate-300" title={review.comment}>
                                                {review.comment}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {review.isInstantFeedback ? (
                                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                                    Instant
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                                                    Product
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
