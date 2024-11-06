<?php
// tests/Service/CalculatorServiceTest.php
namespace App\Tests\Service;

use PHPUnit\Framework\TestCase;

class CalculatorServiceTest extends TestCase
{
    public function testAdd(): void
    {
    $result = 2 + 3;

        $this->assertEquals(5, $result, "Addition de 2 et 3 devrait être 5.");
    }
}
