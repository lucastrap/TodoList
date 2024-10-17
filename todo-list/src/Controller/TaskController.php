<?php

namespace App\Controller;



use App\Entity\Task;
use Symfony\Component\HttpFoundation\Response; // Assurez-vous que cette ligne est présente

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class TaskController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    
  
    #[Route('/index', name: 'index')]
    public function index(): Response
    {
        $filePath = $this->getParameter('kernel.project_dir') . '/index.html';

        $html = file_get_contents($filePath);

        return new Response($html);
    }

    #[Route('/api/tasks', methods: ['GET'])]
    public function getTasks(): JsonResponse
    {
        $tasks = $this->entityManager->getRepository(Task::class)->findAll();
        $data = [];

        foreach ($tasks as $task) {
            $data[] = [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'completed' => $task->isCompleted(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/tasks', methods: ['POST'])]
    public function addTask(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $task = new Task();
        $task->setTitle($data['title']);
        $task->setCompleted(false);

        $this->entityManager->persist($task);
        $this->entityManager->flush();

        return $this->json(['id' => $task->getId(), 'title' => $task->getTitle(), 'completed' => false]);
    }

    #[Route('/api/tasks/{id}', methods: ['DELETE'])]
    public function deleteTask(int $id): JsonResponse
    {
        $task = $this->entityManager->getRepository(Task::class)->find($id);
        if ($task) {
            $this->entityManager->remove($task);
            $this->entityManager->flush();
            return new JsonResponse(null, 204);
        }

        return new JsonResponse(['error' => 'Task not found'], 404);
    }

    #[Route('/api/tasks/{id}', methods: ['PUT'])]
    public function completeTask(int $id): JsonResponse
    {
        $task = $this->entityManager->getRepository(Task::class)->find($id);
        
        if ($task) {
            $task->setCompleted(true);
            $this->entityManager->flush(); 
    
            return new JsonResponse(['message' => 'Task completed successfully'], 200);
        }
    
        return new JsonResponse(['error' => 'Task not found'], 404);
    }
    
}
