import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { Task } from "../types";

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export function useProjectTaskSocket(projectId: number | null, onTaskUpdate: (task: Task) => void) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/projects/${projectId}/tasks`, (message) => {
        const task: Task = JSON.parse(message.body);
        onTaskUpdate(task);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [projectId]);
}